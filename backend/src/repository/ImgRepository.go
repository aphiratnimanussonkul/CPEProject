package repository

import (
	"CPEProject/src/models"
	// "time"
	"gopkg.in/mgo.v2"
)

type ImgRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewImgRepository(db *mgo.Database, collection string) *ImgRepositoryMongo{
	return &ImgRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *ImgRepositoryMongo) Save(Img *models.Img) error{
	err := r.db.C(r.collection).Insert(Img)
	return err
}

