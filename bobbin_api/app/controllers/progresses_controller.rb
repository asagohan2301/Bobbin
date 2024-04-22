class ProgressesController < ApplicationController
  def index
    progresses = Progress.where(group_id: 1)
    formatted_progresses = progresses.map do |progress|
      {
        id: progress.id,
        progress_status: progress.progress_status
      }
    end
    render json: { progresses: formatted_progresses }, status: :ok
  end
end
