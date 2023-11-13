
import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'

import Home from '../screens/Home'
import ListaCarros from '../screens/ListaCarros/ListaCarros'
import ListaCarrosAsyncStorage from '../screens/ListaCarrosAsyncStorage/ListaCarros'
import StackPessoas from '../screens/Pessoas/StackPessoas'
import StackPessoasAsyncStorage from '../screens/PessoasAsyncStorage/StackPessoasAsyncStorage'
import StackPessoasFormularioAltoNivel from '../screens/pets/StackPets'
import Cadastro from '../screens/Cadastro/Cadastro'
import StackPets from '../screens/pets/StackPets'

const Drawer = createDrawerNavigator()

export default function DrawerRoutes() {
    return (
        <Drawer.Navigator initialRouteName='Cadastro'>

            <Drawer.Screen name="StackPets" component={StackPets} />

            <Drawer.Screen name="Cadastro" component={Cadastro} />

        </Drawer.Navigator>

    )
}