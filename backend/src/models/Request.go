package models

import (
	"gopkg.in/mgo.v2/bson"
)
type Request struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	SubjectCode		string 		`json:"subjectcode"`
	SubjectName		string 		`json:"subjectname"`
	Timestamp 	string  	`json:"timestamp"`
	Date		string 		`json:"date"`
	User		*User		`bson:"user" json:"user"`
}

type Requests []Request
