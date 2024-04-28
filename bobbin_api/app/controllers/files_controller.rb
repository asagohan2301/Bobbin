class FilesController < ApplicationController
  def proxy
    file = ActiveStorage::Blob.find(params[:id])
    data = file.download
    send_data data, filename: file.filename.to_s, type: file.content_type, disposition: 'inline'
  end
end
