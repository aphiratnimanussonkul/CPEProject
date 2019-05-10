package repository

import (
  "fmt"
  // "time"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"

  "CPEProject/src/models"
)

//profileRepositoryMongo
type FacultyRepositoryMongo struct {
  db *mgo.Database
  collection string
}

//NewProfileRepositoryMongo
func NewFacultyRepositoryMongo(db *mgo.Database, collection string) *FacultyRepositoryMongo{
  return &FacultyRepositoryMongo{
    db: db,
    collection: collection,
  }
}

//Save
func (r *FacultyRepositoryMongo) Save(faculty *models.Faculty) error{
  err := r.db.C(r.collection).Insert(faculty)
  return err
}

//Update
func (r *FacultyRepositoryMongo) Update(faculty *models.Faculty) error{
  //fmt.Println("In FacRepo")
  //faculty.Name = "MTT"
  //
  //err := r.db.C(r.collection).Update(bson.M{"_id": faculty.ID},
  //   bson.M{"$set": bson.M{"name": "MTT",
  //      "major": major.ID}})
  //return err
  fmt.Println("In FacRepo")
  err := r.db.C(r.collection).Update(bson.M{"_id": faculty.ID}, faculty)
  return err
}




//Delete
func (r *FacultyRepositoryMongo) Delete(id bson.ObjectId) error{
  err := r.db.C(r.collection).Remove(bson.M{"_id": id})
  return err
}

//FindByID
func (r *FacultyRepositoryMongo) FindByID(id string) (*models.Faculty, error){
  var faculty models.Faculty
  err := r.db.C(r.collection).Find(nil).One(&faculty)

  if err != nil {
    return nil, err
  }

  return &faculty, nil
}

//FindAll
func (r *FacultyRepositoryMongo) FindAll() (models.Faculties, error){
  var faculty models.Faculties

  err := r.db.C(r.collection).Find(bson.M{}).All(&faculty)

  if err != nil {
    return nil, err
  }

  return faculty, nil
}

func (r *FacultyRepositoryMongo) FindByName(name string) (*models.Faculty, error){
  var faculty models.Faculty
  err := r.db.C(r.collection).Find(bson.M{"name": name}).One(&faculty)

  if err != nil {
    return nil, err
  }

  return &faculty, nil
}
func (r *FacultyRepositoryMongo) DeleteByName(name string) error{
  err := r.db.C(r.collection).Remove(bson.M{"name": name})
  return err
}
