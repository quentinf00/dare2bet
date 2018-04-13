## Create the cloudformation stack (only the first time)


```bash
aws --region eu-central-1 cloudformation create-stack --stack-name DrinkingGameRHQ --template-body file://api/.yml
```