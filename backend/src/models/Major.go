package models

import "gopkg.in/mgo.v2/bson"

type Major struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name		string 		`json:"name"`
	Faculty     *Faculty      `bson:"faculty" json:"faculty"`
}

type Majors []Major
type MajorPointer []*Major
