package models

import "gopkg.in/mgo.v2/bson"

type Img struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Name	  string 		`json:"name"`
	Img 	  string		`json:"img" bson:"img" `
}
//

