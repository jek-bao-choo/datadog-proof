curl -X POST "https://api.datadoghq.com/api/v1/events" \
-H "Content-Type: application/json" \
-H "DD-API-KEY: ${DD_API_KEY}" \
-d @- << EOF
{
  "text": "Wow!",
  "title": "Did you hear the news today?",
  "tags": ["env:api-course"]
}
EOF