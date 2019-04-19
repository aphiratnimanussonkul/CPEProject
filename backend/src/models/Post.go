package models

import (
	"gopkg.in/mgo.v2/bson"
)
type Post struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Text		string 		`json:"text"`
	Timestamp 	string  	`json:"timestamp"`
	Date		string 		`json:"date"`
	User		*User		`bson:"user" json:"user"`
	VdoLink		string   	`json:"vdoLink"`
	Img	        string 		`json:"img"`
	Subject		*Subject	`bson:"subject" json:"subject"`
}

type Posts []Post
