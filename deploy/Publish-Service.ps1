$zipFile = $args[0]
$s3File = "s3://WriteItDown/latest.zip"

$s3FileOld = $s3File + "." + (Get-Date -UFormat "%Y-%m-%d-%H-%M");
Write-Output "Copying $s3File to $s3FileOld..."
& aws s3 cp $s3File $s3FileOld 
Write-Output "Copying $zipFile to $s3File..."
& aws s3 cp $zipFile $s3File
Write-Output "Done copying to $s3File"


