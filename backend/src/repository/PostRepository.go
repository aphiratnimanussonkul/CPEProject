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
func (r *PostRepositoryMongo) Update(post *models.Post) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"_id": post.ID}, post)
	return err
}

//Delete
func (r *PostRepositoryMongo) Delete(post *models.Post) error{
	err := r.db.C(r.collection).Remove(bson.M{"_id": post.ID})
	return err
}

//FindByID
func (r *PostRepositoryMongo) FindByID(id bson.ObjectId) (*models.Post, error){
	var post models.Post
	err := r.db.C(r.collection).Find(bson.M{"_id": id}).One(&post)

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
func (r *PostRepositoryMongo) FindByCode(code string) (models.Posts, error){
	var post models.Posts
	err := r.db.C(r.collection).Find(bson.M{"subject.code": code}).All(&post)

	if err != nil {
		return nil, err
	}

	return post, nil
}
