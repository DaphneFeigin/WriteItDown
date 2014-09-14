$sourceDir = "C:\Users\Becky\Documents\GitHub\WriteItDown"
$tmpZip = "C:\temp\tmp.zip"

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
Write-Output "Zipping $sourceDir to $tmpZip..."
if (Test-Path $tmpZip) {
    Remove-Item $tmpZip
}
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $tmpZip, $compressionLevel, $false)
Write-Output "Done zipping $tmpZip"

& .\deploy\Publish-Service.ps1 $tmpZip

