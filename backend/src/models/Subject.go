package models

import "gopkg.in/mgo.v2/bson"

type Subject struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name		string 		`json:"name"`
	Code		string			`json:"code"`
	Major       *Major       `bson:"major" json:"major"`
}
type Subjects []Subject