package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type RequestRepository struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewRequestRepository(db *mgo.Database, collection string) *RequestRepository{
	return &RequestRepository{
		db: db,
		collection: collection,
	}
}

//Save
func (r *RequestRepository) Save(user *models.Request) error{
	err := r.db.C(r.collection).Insert(user)
	return err
}

//Update
func (r *RequestRepository) Update( request *models.Request) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"_id": request.ID}, request)
	return err
}

//Delete
func (r *RequestRepository) Delete(request *models.Request) error{
	err := r.db.C(r.collection).Remove(bson.M{"_id": request.ID})
	return err
}

//FindByID
func (r *RequestRepository) FindByID(id bson.ObjectId) (*models.Request, error){
	var request models.Request
	err := r.db.C(r.collection).Find(bson.M{"_id": id}).One(&request)

	if err != nil {
		return nil, err
	}

	return &request, nil
}

//FindAll
func (r *RequestRepository) FindAll() (models.Requests, error){
	var request models.Requests

	err := r.db.C(r.collection).Find(nil).All(&request)
	if err != nil {
		return nil, err
	}
	return request, nil
}


//FindByName
func (r *RequestRepository) FindByName(name string) (*models.Request, error){
	var request models.Request
	err := r.db.C(r.collection).Find(bson.M{"text": name}).One(&request)

	if err != nil {
		return nil, err
	}

	return &request, nil
}
func (r *RequestRepository) FindByCode(code string) (models.Requests, error){
	var request models.Requests
	err := r.db.C(r.collection).Find(bson.M{"subject.code": code}).All(&request)

	if err != nil {
		return nil, err
	}

	return request, nil
}
