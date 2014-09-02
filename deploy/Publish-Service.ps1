$sourceDir = "C:\Users\Becky\Documents\GitHub\WriteItDown"
$tmpZip = "C:\temp\tmp.zip"
$s3Bucket = "s3://WriteItDown/latest.zip"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
Write-Output "Zipping $sourceDir to $tmpZip..."
if (Test-Path $tmpZip) {
    Remove-Item $tmpZip
}
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $tmpZip, $compressionLevel, $false)
Write-Output "Done zipping $tmpZip"

Write-Output "Copying $tmpZip to $s3Bucket..."
& aws s3 cp $tmpZip $s3Bucket
Write-Output "Done copying to $s3Bucket"


