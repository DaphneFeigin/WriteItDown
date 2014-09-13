$sourceDir = "C:\Users\Becky\Documents\GitHub\WriteItDown"
$tmpZip = "C:\temp\tmp.zip"
$s3File = "s3://WriteItDown/latest.zip"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
Write-Output "Zipping $sourceDir to $tmpZip..."
if (Test-Path $tmpZip) {
    Remove-Item $tmpZip
}
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $tmpZip, $compressionLevel, $false)
Write-Output "Done zipping $tmpZip"

$s3FileOld = $s3File + "." + (Get-Date -UFormat "%Y-%m-%d-%H-%M");
Write-Output "Copying $s3File to $s3FileOld..."
& aws s3 cp $s3File $s3FileOld 
Write-Output "Copying $tmpZip to $s3File..."
& aws s3 cp $tmpZip $s3File
Write-Output "Done copying to $s3File"


