Download AWS CLI and make sure it is in your $ENV:PATH.
You will need credentials for a user in the WriteItDownDevelopers group.  Add those credentials with "aws configure"

The command to launch the stack from the CloudFormation template would look like this
 aws cloudformation create-stack --stack-name MyStackName --template-body file://C:\path\to\WriteItDown\deploy\stack_template.json --parameters "ParameterKey=KeyName,ParameterValue=MIKE_inst" --capabilities CAPABILITY_IAM