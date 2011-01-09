#!/bin/sh
protoc --python_out=. fileformat.proto 
protoc --python_out=. osmformat.proto 
