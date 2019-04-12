package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type UserRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewUserRepository(db *mgo.Database, collection string) *UserRepositoryMongo{
	return &UserRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *UserRepositoryMongo) Save(user *models.User) error{
	err := r.db.C(r.collection).Insert(user)
	return err
}

//Update
func (r *UserRepositoryMongo) Update(id string, user *models.User) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"id": id}, user)
	return err
}

//Delete
func (r *UserRepositoryMongo) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *UserRepositoryMongo) FindByID(id string) (*models.User, error){
	var user models.User
	err := r.db.C(r.collection).Find(nil).One(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

//FindAll
func (r *UserRepositoryMongo) FindAll() (models.Users, error){
	var user models.Users

	err := r.db.C(r.collection).Find(bson.M{}).All(&user)

	if err != nil {
		return nil, err
	}

	return user, nil
}


//FindByName
func (r *UserRepositoryMongo) FindByName(name string) (*models.User, error){
	var user models.User
	err := r.db.C(r.collection).Find(bson.M{"firstname": name}).One(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}