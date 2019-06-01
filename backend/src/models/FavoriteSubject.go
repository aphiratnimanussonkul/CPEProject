package models

import "gopkg.in/mgo.v2/bson"

type FavoriteSubject struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty"`
	User		*User		`bson:"user" json:"user"`
	Subject		*Subject	`bson:"subject" json:"subject"`
}
type FavoriteSubjects []FavoriteSubject