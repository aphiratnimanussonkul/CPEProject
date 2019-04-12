package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type PostRepositoryMongo struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewPostRepository(db *mgo.Database, collection string) *PostRepositoryMongo{
	return &PostRepositoryMongo{
		db: db,
		collection: collection,
	}
}

//Save
func (r *PostRepositoryMongo) Save(user *models.Post) error{
	err := r.db.C(r.collection).Insert(user)
	return err
}

//Update
func (r *PostRepositoryMongo) Update(id string, post *models.Post) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"id": id}, post)
	return err
}

//Delete
func (r *PostRepositoryMongo) Delete(id string) error{
	err := r.db.C(r.collection).Remove(bson.M{"id": id})
	return err
}

//FindByID
func (r *PostRepositoryMongo) FindByID(id string) (*models.Post, error){
	var post models.Post
	err := r.db.C(r.collection).Find(nil).One(&post)

	if err != nil {
		return nil, err
	}

	return &post, nil
}

//FindAll
func (r *PostRepositoryMongo) FindAll() (models.Posts, error){
	var post models.Posts

	err := r.db.C(r.collection).Find(nil).All(&post)
	if err != nil {
		return nil, err
	}
	return post, nil
}


//FindByName
func (r *PostRepositoryMongo) FindByName(name string) (*models.Post, error){
	var post models.Post
	err := r.db.C(r.collection).Find(bson.M{"text": name}).One(&post)

	if err != nil {
		return nil, err
	}

	return &post, nil
}
