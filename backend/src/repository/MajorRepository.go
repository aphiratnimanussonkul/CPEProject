package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type MajorRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewMajorRepository(db *mgo.Database, collection string) *MajorRepositoryMongo{
	return &MajorRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *MajorRepositoryMongo) Save(major *models.Major) error{
	err := r.db.C(r.collection).Insert(major)
	return err
}

//Update
func (r *MajorRepositoryMongo) Update(id string, major *models.Major) error{
	err := r.db.C(r.collection).Update(bson.M{"id": id}, major)
	return err
}

//Delete
func (r *MajorRepositoryMongo) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *MajorRepositoryMongo) FindByID(id string) (*models.Major, error){
	var major models.Major
	err := r.db.C(r.collection).Find(nil).One(&major)

	if err != nil {
		return nil, err
	}

	return &major, nil
}

//FindAll
func (r *MajorRepositoryMongo) FindAll() (models.Majors, error){
	var major models.Majors

	err := r.db.C(r.collection).Find(bson.M{}).All(&major)

	if err != nil {
		return nil, err
	}

	return major, nil
}


//FindByName
func (r *MajorRepositoryMongo) FindByName(name string) (*models.Major, error){
	var major models.Major
	err := r.db.C(r.collection).Find(bson.M{"name": name}).One(&major)

	if err != nil {
		return nil, err
	}

	return &major, nil
}