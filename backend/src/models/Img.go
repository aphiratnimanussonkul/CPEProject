package models

import "gopkg.in/mgo.v2/bson"

type Img struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Link	  string 		`json:"link"`

}
//

