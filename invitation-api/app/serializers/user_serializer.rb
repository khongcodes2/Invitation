class UserSerializer < ActiveModel::Serializer
  attributes :username, :img_url, :name, :bio
end
