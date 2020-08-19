import React, { ChangeEvent, FormEvent, useEffect, useState, useContext } from 'react'
import { User } from 'firebase'
import { useUser } from 'reactfire'
import { useFirestore } from 'reactfire/firebaseApp/sdk'

import { Button, Form, Icon, Input, Menu, Modal } from 'semantic-ui-react'
import { checkFields } from '../../helpers/form'
import { DisplayChannels } from '../../helpers/channel'
import { IChannel } from '../../types/Channels'
import { ChannelContext } from '../../contexts/Channel'

function Channels() {
  const channelsCollection = useFirestore().collection('channels')
  const user = useUser<User>()
  const [, setChannel] = useContext(ChannelContext)

  useEffect(() => {
    const unsubscribe = channelsCollection.onSnapshot((snapshot) => {
      const updates = snapshot.docChanges().map((channel) => ({ ...channel.doc.data(), id: channel.doc.id }))

      setChannels((c: any) => [...c, ...updates])

      const firstChannel = channels[0]
      const setActiveChannel = activeChannelState[1]

      if (isFirstLoad && !!channels.length) {
        setChannel!(firstChannel)
        setActiveChannel(firstChannel.id)
      }

      setIsFirstLoad(false)
    })

    return () => {
      unsubscribe()
    }
  })

  const [channelName, setChannelName] = useState('')
  const [channelDetails, setChannelDetails] = useState('')
  const [channels, setChannels] = useState<IChannel[]>([])
  const [isModal, setIsModal] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const activeChannelState = useState<string | null>(null)

  const openModal = () => setIsModal(true)
  const closeModal = () => setIsModal(false)

  const handleChange = ({ target: { id, value } }: ChangeEvent<HTMLInputElement>) => {
    id === 'channelName' && setChannelName(value)
    id === 'channelDetails' && setChannelDetails(value)
  }

  const handleSubmit = async (ev: FormEvent | MouseEvent) => {
    ev.preventDefault()

    const [isValid] = checkFields(channelName, channelDetails)

    if (!isValid) return

    try {
      await channelsCollection.add({
        name: channelName,
        about: channelDetails,
        createdBy: {
          username: user.displayName,
          avatar: user.photoURL,
        },
      })

      setChannelName('')
      setChannelDetails('')
      closeModal()
    } catch (error) {
      console.error(error)
    }

    // TODO: show success/error in the UI
  }

  return (
    <>
      <Menu.Menu className="pb-8">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{' '}
          ({channels.length}) <Icon name="add" className="cursor-pointer" onClick={openModal} />
        </Menu.Item>

        {/* {DisplayChannels(activeChannelState, [
          {
            id: 'sports',
            name: 'sports',
            about: 'string',
            createdBy: {
              username: 'string',
              avatar: 'string',
            },
          },
          {
            id: 'music',
            name: 'music',
            about: 'string',
            createdBy: {
              username: 'string',
              avatar: 'string',
            },
          },
        ])} */}
        {DisplayChannels(activeChannelState, channels)}
      </Menu.Menu>

      <Modal basic open={isModal} onClose={closeModal}>
        <Modal.Header>Add a Channel</Modal.Header>

        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input fluid label="Name of Channel" id="channelName" onChange={handleChange} />
            </Form.Field>

            <Form.Field>
              <Input fluid label="About the Channel" id="channelDetails" onChange={handleChange} />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button inverted color="green" onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>

          <Button inverted color="red" onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default Channels