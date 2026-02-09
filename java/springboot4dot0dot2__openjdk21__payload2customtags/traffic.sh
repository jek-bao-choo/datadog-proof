#!/bin/bash

ERROR_CODES=("AC01" "FF02" "AC03" "FF10" "DS04" "DS24")
SWIFT_CODES=("OCBCSGSGXXX" "BNORPHMMXXX" "DBSSSGSGXXX" "PNBMPHMMXXX" "WUFSUS55XXX" "EBILAEADXXX")
DIMENSIONS=("creditOtherBank" "creditCASAOnLine" "pickUpCash" "checkStatus")

while true; do
  error=${ERROR_CODES[$RANDOM % ${#ERROR_CODES[@]}]}
  swift=${SWIFT_CODES[$RANDOM % ${#SWIFT_CODES[@]}]}
  dimension=${DIMENSIONS[$RANDOM % ${#DIMENSIONS[@]}]}

  echo "Sending: customErrorCode=$error, customBankCode=$swift, customDimensionCode=$dimension"
  curl -s -X GET http://3.1.102.190:8080/payload-to-spantags \
    -H "Content-Type: application/json" \
    -d "{\"customErrorCode\":\"$error\", \"customBankCode\":\"$swift\", \"customDimensionCode\":\"$dimension\"}"
  echo ""

  sleep 10
done
