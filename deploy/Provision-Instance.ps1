$ami = "ami-76817c1e"
$subnetId = "subnet-f88472a1"
$sgId = "sg-fa82dc9f"
$keyName = "MIKE_inst"
$cloudInitFile = "file://c:/Users/Becky/Documents/GitHub/WriteItDown/deploy/cloud.init"

aws ec2 run-instances --image-id $ami --security-group-ids $sgId --user-data $cloudInitFile --instance-type t2.micro --subnet-id $subnetId --key-name $keyName