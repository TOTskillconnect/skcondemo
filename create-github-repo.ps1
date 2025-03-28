# PowerShell script to create a GitHub repository
param(
    [Parameter(Mandatory=$true)]
    [string]$repoName,
    
    [Parameter(Mandatory=$false)]
    [switch]$isPrivate = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$description = ""
)

# Prompt for GitHub Personal Access Token if not already set
if (-not $env:GITHUB_TOKEN) {
    $secureToken = Read-Host -Prompt "Enter your GitHub Personal Access Token" -AsSecureString
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
    $env:GITHUB_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
}

# Create the request body
$body = @{
    name = $repoName
    private = $isPrivate.IsPresent
    description = $description
} | ConvertTo-Json

# Setup headers with authentication
$headers = @{
    Authorization = "Bearer $env:GITHUB_TOKEN"
    Accept = "application/vnd.github.v3+json"
}

# Make the API request to create the repository
try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repository created successfully: $($response.html_url)" -ForegroundColor Green
    
    # Set the remote URL for the local git repository
    $remoteUrl = $response.clone_url
    
    # Check if we're in a git repository already
    if (Test-Path .git) {
        # Add the remote
        git remote add origin $remoteUrl
        
        # Push to GitHub
        Write-Host "Use 'git push -u origin main' to push your code to GitHub" -ForegroundColor Yellow
    } else {
        Write-Host "Initialize a git repository with:" -ForegroundColor Yellow
        Write-Host "git init" -ForegroundColor Cyan
        Write-Host "git remote add origin $remoteUrl" -ForegroundColor Cyan
        Write-Host "git add ." -ForegroundColor Cyan
        Write-Host "git commit -m 'Initial commit'" -ForegroundColor Cyan
        Write-Host "git push -u origin main" -ForegroundColor Cyan
    }
    
    return $remoteUrl
}
catch {
    Write-Host "Error creating repository: $_" -ForegroundColor Red
    return $null
} 