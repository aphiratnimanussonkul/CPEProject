package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type FavoriteSubjectRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewFavoriteSubjectRepository(db *mgo.Database, collection string) *FavoriteSubjectRepositoryMongo{
	return &FavoriteSubjectRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *FavoriteSubjectRepositoryMongo) Save(favoriteSubject *models.FavoriteSubject) error{
	err := r.db.C(r.collection).Insert(favoriteSubject)
	return err
}

//Update
func (r *FavoriteSubjectRepositoryMongo) Update(id string, favoriteSubject *models.FavoriteSubject) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"id": id}, favoriteSubject)
	return err
}

//Delete
func (r *FavoriteSubjectRepositoryMongo) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *FavoriteSubjectRepositoryMongo) FindByID(id string) (*models.FavoriteSubject, error){
	var favoriteSubject models.FavoriteSubject
	err := r.db.C(r.collection).Find(nil).One(&favoriteSubject)

	if err != nil {
		return nil, err
	}

	return &favoriteSubject, nil
}

//FindAll
func (r *FavoriteSubjectRepositoryMongo) FindAll() (models.FavoriteSubjects, error){
	var favoriteSubject models.FavoriteSubjects

	err := r.db.C(r.collection).Find(bson.M{}).All(&favoriteSubject)

	if err != nil {
		return nil, err
	}

	return favoriteSubject, nil
}

//FindByEmail
func (r *FavoriteSubjectRepositoryMongo) FindByEmail(useremail string) (models.FavoriteSubjects, error){
	var email models.FavoriteSubjects
	err := r.db.C(r.collection).Find(bson.M{"user.email": useremail}).All(&email)

	if err != nil {
		return nil, err
	}

	return email, nil
}

//FindBySubject
func (r *FavoriteSubjectRepositoryMongo) FindBySubject(subjectName string) (models.FavoriteSubjects, error){
	var name models.FavoriteSubjects
	err := r.db.C(r.collection).Find(bson.M{"user.email": subjectName}).All(&name)

	if err != nil {
		return nil, err
	}

	return name, nil
}