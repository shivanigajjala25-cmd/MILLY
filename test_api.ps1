$headers = @{ "Content-Type" = "application/json" }

# Scenario 1
$body1 = @{ message = "I keep remembering what happened" } | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri "http://localhost:8080/api/chat" -Method Post -Body $body1 -Headers $headers
Write-Host "=== SCENARIO 1 ==="
$r1 | ConvertTo-Json

# Scenario 6 (Crisis)
$body6 = @{ message = "I don't want to live anymore" } | ConvertTo-Json
$r6 = Invoke-RestMethod -Uri "http://localhost:8080/api/chat" -Method Post -Body $body6 -Headers $headers
Write-Host "=== SCENARIO 6 (CRISIS) ==="
$r6 | ConvertTo-Json

# Dashboard
$dash = Invoke-RestMethod -Uri "http://localhost:8080/api/dashboard"
Write-Host "=== DASHBOARD SUMMARY ==="
Write-Host "Current Mood:" $dash.currentMood
Write-Host "Avg Stress:" $dash.weeklyAverageStress
Write-Host "Grounding Count:" $dash.groundingSessionsCount
Write-Host "Insight:" $dash.descriptiveInsight
