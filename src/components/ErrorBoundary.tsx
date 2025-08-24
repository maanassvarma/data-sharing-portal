import React from 'react'

export class ErrorBoundary extends React.Component<React.PropsWithChildren, { error?: Error }> {
  state: { error?: Error } = {}
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return <div role="alert" className="p-4 text-red-600">Error: {this.state.error.message}</div>
    }
    return this.props.children
  }
}
