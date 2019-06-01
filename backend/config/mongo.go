package config

import (
  "os"

  "gopkg.in/mgo.v2"
)

func GetMongoDB() (*mgo.Database, error) {
  host := os.Getenv("cluster0-swldy.mongodb.net:27017")
  //dbName := os.Getenv("People")
  session, err := mgo.Dial(host)
  if err != nil {
    return nil, err
  }
  db := session.DB("CourseOnline")
  return db, nil
}
