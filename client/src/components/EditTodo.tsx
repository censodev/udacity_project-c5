import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getTodos, getUploadUrl, patchTodo, uploadFile } from '../api/todos-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditTodoProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditTodoState {
  name: string
  dueDate: string
  done: boolean
  file: any
  uploadState: UploadState
}

export class EditTodo extends React.PureComponent<
  EditTodoProps,
  EditTodoState
> {
  state: EditTodoState = {
    name: '',
    dueDate: '',
    done: false,

    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleSubmitUpdateTodo = async () => {
    console.log(this.state);
    patchTodo(this.props.auth.getIdToken(), this.props.match.params.todoId, {
      name: this.state.name,
      dueDate: this.state.dueDate,
      done: this.state.done
    })
    .then(() => alert('Update todo successfully!'))
    .catch(err => {
      console.log(err);
      alert('Update todo failed!')
    })
  }

  async componentDidMount() {
    try {
      const todos = await 
      getTodos(this.props.auth.getIdToken())
      const todo = todos.find(td => td.todoId === this.props.match.params.todoId) || {
        name: '',
        dueDate: '',
        done: false,
      }
      this.setState({
        name: todo.name,
        dueDate: todo.dueDate,
        done: todo.done
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e}`)
    }
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.todoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Edit Todo</h1>
        <Form onSubmit={this.handleSubmitUpdateTodo}>
          <Form.Field>
            <label htmlFor="">Name</label>
            <input type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label htmlFor="">Due Date</label>
            <input type="date" value={this.state.dueDate} onChange={e => this.setState({ dueDate: e.target.value })}/>
          </Form.Field>
          <Button>Update</Button>
        </Form>

        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
