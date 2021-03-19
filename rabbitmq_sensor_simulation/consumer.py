#!/usr/bin/env python
import pika, json, datetime

brokerHost  = 'roedeer.rmq.cloudamqp.com'
port        = 5672
username    = 'vnchtioo'
password    = 'BydwQLVAZoaARUMHBfalp8MVDrB152tu'
exchange    = 'patientSensorData'

def callback(ch, method, properties, body):
    print("[{}] Received:\n{}\n".format(
        datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 
        json.dumps(json.loads(body), indent=4)
    ))

def main():
    credentials = pika.PlainCredentials(username, password)
    parameters = pika.ConnectionParameters(brokerHost,
                                       port,
                                       username,
                                       credentials)

    with pika.BlockingConnection(parameters) as connection:
        channel = connection.channel()

        channel.exchange_declare(exchange=exchange, exchange_type='fanout')
        
        result = channel.queue_declare(queue='', exclusive=True)

        channel.queue_bind(exchange=exchange, queue=result.method.queue)

        channel.basic_consume(queue=result.method.queue, on_message_callback=callback, auto_ack=True)

        print(' [{}] Waiting for messages. To exit press CTRL+C\n'.format(
            datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ))
        channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')