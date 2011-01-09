#!/usr/bin/python

import osmformat_pb2
import fileformat_pb2
import sys
import socket
import zlib
from binarystream import BinaryStream


headerSizeMax = 64 * 1024
bodySizeMax = 32*1024*1024

f = open("berlin.osm.pbf")
stream = BinaryStream(f)
headerSize = socket.ntohl(stream.readUInt32());

if headerSizeMax < headerSize:
    raise ValueError("Header to long")

headerbuff = stream.readBytes(headerSize)
blobheader = fileformat_pb2.BlobHeader()
blobheader.ParseFromString(headerbuff)
bodysize = blobheader.datasize

if bodySizeMax < bodysize:
    raise ValueError("Body to fat")

blobbuff = stream.readBytes(bodysize)
blob = fileformat_pb2.Blob()
blob.ParseFromString(blobbuff)

if blob.raw != "": 
    rawstr = blob.raw
else:
    rawstr = zlib.decompress(blob.zlib_data)

headerblock = osmformat_pb2.HeaderBlock()
headerblock.ParseFromString(rawstr)

print "Source:",headerblock.source
print "Writingprog:",headerblock.writingprogram
print "required features:",headerblock.required_features

