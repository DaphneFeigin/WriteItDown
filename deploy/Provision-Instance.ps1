$ami = "ami-76817c1e"
$subnetId = "subnet-f88472a1"
$sgId = "sg-fa82dc9f"
$keyName = "$env:COMPUTERNAME" + "_inst"
$instanceProfileArn = "arn:aws:iam::516893983603:instance-profile/WriteItDownService" 
$scriptPath = Split-Path $MyInvocation.MyCommand.Path
$cloudInitFile = Join-Path $scriptPath "cloud.init"
$hostedZoneId = "Z20BYPRBXXH5ZP"

Write-Output "Launching instance with init script $cloudInitFile"
Get-Content $cloudInitFile

$runInstanceResponse = [string](aws ec2 run-instances --image-id $ami --iam-instance-profile Arn=$instanceProfileArn --security-group-ids $sgId --user-data file://$cloudInitFile --instance-type t2.micro --subnet-id $subnetId --key-name $keyName --output json)

$instanceObj = ConvertFrom-Json $runInstanceResponse;
$instanceId = $instanceObj.Instances[0].InstanceId;
Write-Output "Your instance: $instanceId"

Write-Output "Wait for running..."
do {
    $instanceDescResponse = [string](aws ec2 describe-instances --instance-ids $instanceId --output json)
    $instanceDesc = ConvertFrom-Json $instanceDescResponse
    $state = $instanceDesc.Reservations[0].Instances[0].State.Name;
    if ($state.CompareTo("running")) {
        Sleep 5
    }
} until (-not ($state.CompareTo("running")))

$publicIp = $instanceDesc.Reservations[0].Instances[0].PublicIpAddress
Write-Output "Running.  Public IP $publicIp"

$changeRecord = "{`"Comment`": `"WriteItDown EC2 instance`", `"Changes`": [{`"Action`":`"UPSERT`", `"ResourceRecordSet`":{`"Name`":`"writeitdown.pisomojado.org`",`"Type`":`"A`",`"TTL`":60,`"ResourceRecords`":[{`"Value`":`"$publicIp`"}]}}]}"

$changeRecordFile = Join-Path $env:TEMP "change-record.json"
$changeRecord | Out-File -Encoding ASCII $changeRecordFile
& aws route53 change-resource-record-sets --hosted-zone-id $hostedZoneId --change-batch file://$changeRecordFile

& ipconfig /flushdns
