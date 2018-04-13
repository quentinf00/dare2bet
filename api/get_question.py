import json
import urllib.request
import boto3
import json

qdb_url = "https://opentdb.com/api.php?amount=1&type=boolean"

def run(event, context):
    
    s3 = boto3.client('s3')
    state = load_state(s3)
    [question, answer] = next_question()
    if not state.get('question', []):
        state['question'] = question
        state['correct_answer'] = answer
    dump_state(s3, state)

    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
    }

    return {
        'headers': response_headers,
        'statusCode': 200,
        "body": json.dumps( {"question": state['question'],
            "answers": ['yes', 'no']})
    }




def load_state(s3):

    bucket_content = s3.list_objects_v2(Bucket='dare-to-bet-state-store')
    print(f"Bucket content {[item['Key'] for item in bucket_content.get('Contents', [])]}")
    if 'state.json' in [item['Key'] for item in bucket_content.get('Contents', [])]:
        print('loading existing state')

        with open('/tmp/state.json', 'wb') as data:
            s3.download_fileobj('dare-to-bet-state-store', 'state.json', data)

        with open('/tmp/state.json', 'r') as data:
            state = json.load(data)
            print(f'Loading state: {state}')
            return state
    else:
        print('Initiating state')
        return {}


def dump_state(s3, state):
    print(f'Dumping state: {state}')
    with open('/tmp/state.json', 'w') as data:
        json.dump(state, data)

    with open('/tmp/state.json', 'rb') as data:
        s3.upload_fileobj(data, 'dare-to-bet-state-store', 'state.json')


def next_question(url):
    
    print("Get a question from openTrivia")
    request = urllib.request.urlopen(url)
    trivia = json.loads(request.read())
    results = trivia['results'][0]
    category = results['category']
    difficulty = results['difficulty']
    print("Category : ", category, " level : ", difficulty)
    question = results['question']
    answer = results['correct_answer']
    return [question, answer]

