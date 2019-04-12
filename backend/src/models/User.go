package models

import "gopkg.in/mgo.v2/bson"

type User struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Firstname	string `json:"firstname"`
	Lastname 	string `json:"lastname"`
	Email		string `json:"email"`
}