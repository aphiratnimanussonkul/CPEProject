package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)
type Post struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Text		string 		`json:"text"`
	Timestamp 	time.Time   `json:"timestamp"`
	Date		string 		`json:"date"`
}

