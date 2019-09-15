import React, { Component } from 'react';
import { Card, Icon , Input} from 'react-native-elements';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postCommment } from '../redux/ActionCreators';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal } from 'react-native';
import { Rating } from 'react-native-ratings';
 

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postCommment: (dishId, user_rating, author, comment) => dispatch(postCommment(dishId, user_rating, author, comment))
})



function RenderComments(props) {

    const comments = props.comments;
    console.log('>>>>>>>>>> H E R E COMMENTS<<<<<<<<<<');
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating readonly startingValue={ item.rating } imageSize={15} style={{alignItems: 'flex-start' }} />
               <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}
function RenderDish(props) {

    const dish = props.dish;
    console.log('>>>>>>>>>> H E R E DISH<<<<<<<<<<');
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flexDirection: "row"}}>
                    <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                    <Icon
                    raised
                    reverse
                    name= 'pencil'
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.toggleModal()}
                    />
                    </View>
                </Card>
            );
        }
        else {
            return(<View>nothing to show</View>);
        }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
            favorites: [],
            showModal: false,
            user_rating: '' ,
            author: '',
            comment: ''
        };
    }


    
    toggleModal() {
        console.log('>>>>>>>>>> H E R E toggle modal <<<<<<<<<<');
        this.setState({
            
            showModal: !this.state.showModal
        
        
        });
    }

    handleCommentSubmission(dishId) {
        console.log('>>>>>>>>>> H E R E SUBMITTING <<<<<<<<<<');
        console.log('ID is '+dishId);
        console.log('user_rating is '+this.state.user_rating);
        console.log('author is '+this.state.author);
        console.log('comment is '+this.state.comment);
        this.props.postCommment(dishId, this.state.user_rating, this.state.author, this.state.comment);
        this.toggleModal();
    }
    ratingCompleted(rating) {
        this.setState({
         
            user_rating : rating
        });
      }

    resetForm() {
        this.setState({
         
            showModal: false
        });
    }
  
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        console.log('>>>>>>>>>> H E R E GOING TO RENDER  <<<<<<<<<<');
        return(
            <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={() => this.markFavorite(dishId)} 
                toggleModal ={() => this.toggleModal()}
               
                />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
           
            <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                       <View style = {styles.modal}>
                          <Text style = {styles.modalTitle}>Your Comment</Text>
                         
                          <Rating
                        showRating
                        type="star"
                        startingValue={2}
                        imageSize={30}
                        style={{ paddingVertical: 10 }}
                        onFinishRating={ (value) => {this.ratingCompleted(value)}}
                    />
                           
                      <Text style = {styles.modalText}>Comment Form below!</Text>
                      <View >
                      <Input
                        placeholder="Author"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={ (value) => this.setState({author: value})}
                    />
                 
                        </View>
                        <View >
                       
                        <Input
                        placeholder="Comment"
                        leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                        onChangeText={(value) => this.setState({comment: value})}
                         />
                        </View>
                        <View>
                        <Button
                        onPress={() => this.handleCommentSubmission( this.props.navigation.getParam('dishId',''))}
                        title="Submit"
                        color="#512DA8"
                        style={{marginTop: 10}}
                        accessibilityLabel="Post your comment"
                    />
                    <Button
                        onPress={() =>this.toggleModal()}
                        title="Cancel"
                        color="#888"
                        accessibilityLabel="Dismiss modal"
                    />
                            </View>
                    </View>
                   
         </Modal>
        </ScrollView>
        );
    }
}


// style={{flexDirection: "row"}}

const styles = StyleSheet.create({
  
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);