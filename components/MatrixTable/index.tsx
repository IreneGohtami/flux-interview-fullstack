import { 
  Box, 
  Button, 
  NumberInput, 
  NumberInputField, 
  Table, 
  TableContainer, 
  Tbody, 
  Td, 
  Tfoot, 
  Th, 
  Thead, 
  Tr 
} from '@chakra-ui/react'
import { useState } from 'react'
import { useContext } from 'react'
import { MatrixTableContext, MatrixTableContextProvider } from './context'

type Props = {
  initialMatrix?: import('../../types').Matrix
} & import('react').HTMLAttributes<HTMLDivElement>

/**
 * Add 4 buttons: 
 * - Cancel to reset the matrix to how it was before changing the values (only when in edit mode)
 * - Edit to make the fields editable (only when not in edit mode)
 * - Clear to completely clear the table
 * - Save to save the table
 * @param param0 
 */
const MatrixTable: import('react').FC<Omit<Props, 'initialMatrix'>> = ({ children, ...props }) => {
  // State ------------------------------------------------------------------- //
  const [{ matrix }, dispatch] = useContext(MatrixTableContext)
  const [mode, setMode] = useState('view')

  const renderNumberInput = (duration: string, plan: string) => (
    <NumberInput value={matrix[duration][plan]} inputMode='numeric'>
      <NumberInputField
        name={`${duration}_${plan}`}
        disabled={mode === 'view'}
        bg='white'
        onChange={(e) => dispatch({
          type: 'EDIT_MATRIX',
          payload: { value: e.target.value, duration, plan }
        })}
      />
    </NumberInput>
  )

  const renderTableBody = () => {
    const matrixKeys = [];
    for (const key in matrix) {
      matrixKeys.push(key);
    }

    return (
      matrixKeys.map(duration => (
        <Tr key={duration}>
          <Td>{duration}</Td>
          <Td>
            {renderNumberInput(duration, 'lite')}
          </Td>
          <Td>
            {renderNumberInput(duration, 'standard')}
          </Td>
          <Td>
            {renderNumberInput(duration, 'unlimited')}
          </Td>
        </Tr>
      ))
    );
  }

  // Handlers ---------------------------------------------------------------- //
  // You can save (to api) the matrix here. Remember to update originalMatrix when done.
  const save = async (event) => {
    event.preventDefault();

    await fetch('/api/save-pricing', { method: 'POST', body: JSON.stringify(matrix) })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'heree')
        if (data.error) {
          // Show error message
          alert(data.error)
        } else {
          dispatch({
            type: 'SET_ORIGINAL_MATRIX',
            payload: data
          })
          setMode('view');
        }
      })
  }

  const edit = () => {
    setMode('edit');
  }

  const cancel = () => {
    dispatch({
      type: 'SET_MATRIX'
    })
    setMode('view');
  }

  const clear = () => {
    dispatch({
      type: 'SET_MATRIX',
      metadata: {
        resetToEmpty: true
      }
    })
  }

  // Effects ----------------------------------------------------------------- //

  // Rendering --------------------------------------------------------------- //
  return (
    <Box mt={10}>
      <TableContainer>
        <Table size='sm' variant='simple' bg='#B2F5EA' >
          <Thead>
            <Tr>
              <Th></Th>
              <Th>lite</Th>
              <Th>standard</Th>
              <Th>unlimited</Th>
            </Tr>
          </Thead>
          <Tbody>{renderTableBody()}</Tbody>
          <Tfoot>
            <Tr>
              <Th>
                {
                  mode === 'view' ? (
                    <Button size='xs' onClick={edit}>Edit</Button>
                  ) : (
                    <>
                      <Button size='xs' onClick={save}>Save</Button> &nbsp;
                      <Button size='xs' onClick={cancel}>Cancel</Button> &nbsp;
                      <Button size='xs' onClick={clear}>Clear</Button>
                    </>
                  )
                }
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  )
}

const MatrixTableWithContext: import('react').FC<Props> = ({ initialMatrix, ...props }) => {
  // You can fetch the pricing here or in pages/index.ts
  // Remember that you should try to reflect the state of pricing in originalMatrix.
  // matrix will hold the latest value (edited or same as originalMatrix)

  return (
    <MatrixTableContextProvider initialMatrix={initialMatrix}>
      <MatrixTable {...props} />
    </MatrixTableContextProvider>
  )
}

export default MatrixTableWithContext
