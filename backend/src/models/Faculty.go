package models

import "gopkg.in/mgo.v2/bson"

type Faculty struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name	  string 		`json:"name"`
	Major     *Major       `bson:"major" json:"major"`
}
//
type Faculties []Faculty

