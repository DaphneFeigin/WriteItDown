WriteItDown
===========

To run on a port other than the default 80, e.g. 3000:
 npm config set TaskWebsite:port 3000

AWS credentials are obtained from the EC2 role by default.  To supply those credentials from a file on your machine:
 npm config set TaskWebsite:awsCreds c:\temp\MyCreds.aws
MyCreds.aws is a file with the following JSON:
 {
   "accessKey":"YOUR_ACCESS_KEY_ID",
   "secretAccessKey":"YOUR_SECRET_KEY",
   "region":"us-east-1"
 }


Logs go to /var/log/WriteItDown.log by default.
To change it to log to stderr:
 npm config set TaskWebsite:logging CONSOLE
To change it to log to a particular file
 npm config set TaskWebsite:logging FILE
 npm config set TaskWebsite:logFile c:\temp\MyLog.log
