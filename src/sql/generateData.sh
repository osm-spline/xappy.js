#! /bin/bash
rm -f insert.sql
touch insert.sql

for i in `seq 1 100`; do 
    echo "INSERT INTO \"anamnity#pub\" VALUES
        ( $i , $i.5 , $i.7, 'pub nr $i'); " >> insert.sql
done

for i in `seq 1 100`; do 
    echo "INSERT INTO \"highway#tohell\" VALUES
        ( $i , $i.5 , $i.7, 'highway nr $i'); " >> insert.sql
done

for i in `seq 1 100`; do 
    echo "INSERT INTO \"anamnity#resturant\" VALUES
        ( $i , $i.5 , $i.7, 'restuarant nr $i'); " >> insert.sql
done
