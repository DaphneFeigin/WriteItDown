WriteItDown
===========

To run on a port other than the default 80, e.g. 3000:
 npm config set TaskWebsite:port 3000

Logs go to /var/log/WriteItDown.log by default.
To change it to log to stderr:
 npm config set TaskWebsite:logging CONSOLE
To change it to log to a particular file
 npm config set TaskWebsite:logging FILE
 npm config set TaskWebsite:logFile "c:\\temp\\MyLog.log"
