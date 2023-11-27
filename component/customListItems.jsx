import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { ListItem, Avatar } from "react-native-elements";

export default function CustomListItem({ id, chatRoomId, chatName, enterChat }) {
    return (
        <ListItem key={id} onPress={() => enterChat(id, chatRoomId, chatName)} bottomDivider>
            <Avatar
                rounded
                source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
            />
            <ListItem.Content>
                <ListItem.Title style={{ fontWeight: 800 }}>
                    {chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    Hello Admin.
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

const styles = StyleSheet.create({

})