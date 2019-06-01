package repository

import (
	// "time"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"CPEProject/src/models"
)

type FeedbackRepository struct {
	db *mgo.Database
	collection string
}

//NewProfileRepositoryMongo
func NewFeedbackRepository(db *mgo.Database, collection string) *FeedbackRepository{
	return &FeedbackRepository{
		db: db,
		collection: collection,
	}
}

//Save
func (r *FeedbackRepository) Save(user *models.Feedback) error{
	err := r.db.C(r.collection).Insert(user)
	return err
}

//Update
func (r *FeedbackRepository) Update( feedback *models.Feedback) error{
	//Get ตัวแปรแล้วมาเปลี่ยนค่าแล้ว save
	// faculty.UpdatedAt = time.Now()
	err := r.db.C(r.collection).Update(bson.M{"_id": feedback.ID}, feedback)
	return err
}

//Delete
func (r *FeedbackRepository) Delete(feedback *models.Feedback) error{
	err := r.db.C(r.collection).Remove(bson.M{"_id": feedback.ID})
	return err
}

//FindByID
func (r *FeedbackRepository) FindByID(id bson.ObjectId) (*models.Feedback, error){
	var feedback models.Feedback
	err := r.db.C(r.collection).Find(bson.M{"_id": id}).One(&feedback)

	if err != nil {
		return nil, err
	}

	return &feedback, nil
}

//FindAll
func (r *FeedbackRepository) FindAll() (models.Feedbacks, error){
	var feedback models.Feedbacks

	err := r.db.C(r.collection).Find(nil).All(&feedback)
	if err != nil {
		return nil, err
	}
	return feedback, nil
}


//FindByName
func (r *FeedbackRepository) FindByName(name string) (*models.Feedback, error){
	var feedback models.Feedback
	err := r.db.C(r.collection).Find(bson.M{"text": name}).One(&feedback)

	if err != nil {
		return nil, err
	}

	return &feedback, nil
}
func (r *FeedbackRepository) FindByCode(code string) (models.Feedbacks, error){
	var feedback models.Feedbacks
	err := r.db.C(r.collection).Find(bson.M{"subject.code": code}).All(&feedback)

	if err != nil {
		return nil, err
	}

	return feedback, nil
}
