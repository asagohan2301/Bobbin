class FilesController < ApplicationController
  skip_before_action :authenticate_user, only: [:proxy]

  def proxy
    file = ActiveStorage::Blob.find(params[:id])
    data = file.download
    send_data data, name: file.filename.to_s, type: file.content_type, disposition: 'inline'
  end

  def destroy
    attachment = ActiveStorage::Attachment.find(params[:id])
    attachment.purge
    head :no_content
  end
end
