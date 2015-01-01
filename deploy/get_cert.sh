#!/bin/bash

aws s3 cp s3://WriteItDown/selfsigned_cert.pem .
aws s3 cp s3://WriteItDown/selfsigned_key.pem .

