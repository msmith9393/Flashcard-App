import React, { Component } from 'react';

const Realm = require('realm');

import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    FlatList,
} from 'react-native';

type Props = {};

export default class App extends Component<Props> {
    constructor(props) {
        super(props);

        this.state = {
            realm: {},
            categories: [
                {
                    item: 'Los Animales',
                    key: 0,
                },
                {
                    item: 'El Cuerpo',
                    key: 1,
                },
                {
                    item: 'La Casa',
                    key: 2,
                },
                {
                    item: 'La Ropa',
                    key: 3,
                },
            ],
        };
    }

    componentDidUpdate() {
        console.log('REALM', this.state.realm)

        if (this.state.realm.objects && this.state.realm.objects('Category')) {
            for (let p of this.state.realm.objects('Category')) {
                console.log(`p`, p.name);
            }
            for (let s of this.state.realm.objects('Vocabulary')) {
                console.log(`s`, s.english);
            }
            // console.log('HOLA', this.state.realm.objects('Category'));
        }
    }

    componentWillMount() {
        const categorySchema = {
            name: 'Category',
            properties: {
                name: 'string',
            },
        };
        const vocabularySchema = {
            name: 'Vocabulary',
            properties: {
                english: 'string',
                espanol: 'string',
                category: {type: 'list', objectType: 'Category'},
            },
        };

        Realm.open({
            schema: [
                categorySchema,
                vocabularySchema,
            ]
        }).then((realm) => {
            realm.write(() => {
                // let laCasa = realm.create('Category', {name: 'La Casa'});
                let puerta = realm.create('Vocabulary', {
                    english: 'door',
                    espanol: 'la puerta',
                    category: [{name: 'La Casa'}],
                });
            }
        );
        this.setState({ realm });
  });
}

    addNewCategory() {
        console.log('add new category');
    }

    addNewDeck() {
        console.log('add new deck');
    }

    renderCategory(category, index) {
        return (
            <Text key={category.key} style={styles.category}>
                {category.item}
            </Text>
        );
    }

    renderAction({
        type,
        onPress,
        text,
    }) {
        return (
            <TouchableHighlight
                style={styles.actionContainer}
                onPress={onPress}>
                <View style={styles.actionContent}>
                    {type === 'category' && <Image
                        style={styles.actionIcon}
                        source={require(`./src/images/new_category.png`)} />}
                    {type === 'deck' && <Image
                        style={styles.actionIcon}
                        source={require(`./src/images/new_category.png`)} />}
                    <Text>
                        {text}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View>
                <View>
                    <Text style={styles.header}>
                        Flashcard App
                    </Text>
                </View>
                <View style={styles.actionsContainer}>
                    {this.renderAction({
                        onPress: this.addNewDeck,
                        type: 'deck',
                        text: 'Create Deck',
                    })}
                    {this.renderAction({
                        onPress: this.addNewCategory,
                        type: 'category',
                        text: 'New Category',
                    })}
                </View>
                <View style={styles.categoriesContainer}>
                    {this.state.categories.map((category, index) => this.renderCategory(category))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'orange',
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        paddingBottom: 8,
        paddingTop: 24,
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    actionContainer: {
        borderStyle: 'solid',
        borderColor: '#cecece',
        borderWidth: 1,
        flex: 1,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionContent: {
        flexDirection: 'row',
    },
    actionIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    categoriesContainer: {
        marginTop: 40,
        flex: 1,
        flexDirection: 'column',

    },
    category: {
        backgroundColor: '#fdfdfd',
        marginTop: 8,
        marginBottom: 8,
        padding: 16,
        shadowColor: '#e0e0e0',
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    },
});
