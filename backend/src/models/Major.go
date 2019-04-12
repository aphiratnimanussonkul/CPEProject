package models

import "gopkg.in/mgo.v2/bson"

type Major struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name		string 		`json:"name"`
	Subject     *Subject      `bson:"subject" json:"subject"`
}

type Majors []Major