$ami = "ami-76817c1e"
$subnetId = "subnet-f88472a1"
$sgId = "sg-fa82dc9f"
$keyName = "MIKE_inst"
$instanceProfileArn = "arn:aws:iam::516893983603:instance-profile/WriteItDownService" 
$scriptPath = Split-Path $MyInvocation.MyCommand.Path
$cloudInitFile = Join-Path $scriptPath "cloud.init"
Write-Output "Launching instance with init script $cloudInitFile"
Get-Content $cloudInitFile

aws ec2 run-instances --image-id $ami --iam-instance-profile Arn=$instanceProfileArn --security-group-ids $sgId --user-data file://$cloudInitFile --instance-type t2.micro --subnet-id $subnetId --key-name $keyName