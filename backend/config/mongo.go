package config

import (
  "os"

  mgo "gopkg.in/mgo.v2"
)

func GetMongoDB() (*mgo.Database, error) {
  host := os.Getenv("127.0.0.1:27017")
  //dbName := os.Getenv("People")
  session, err := mgo.Dial(host)
  if err != nil {
    return nil, err
  }
  db := session.DB("CourseOnline")
  return db, nil
}
